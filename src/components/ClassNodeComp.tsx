import { useCallback, memo, FC, useState, useEffect } from 'react'
import React, {
  Connection,
  Edge,
  Handle,
  NodeProps,
  Position,
  useReactFlow,
  addEdge,
} from 'reactflow'
import {
  Divider,
  Box,
  Button,
  Stack,
  Editable,
  EditablePreview,
  EditableInput,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import type { ClassNode, ClassNodeData, fieldPreviewProps } from '../type/ClassNodeComp'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { classNodeSchema } from '../type/zodClassNodeComp.zod'
import { FunctionsFormFields, VarsFormFields } from './FormField'
import { SubmitHandler } from 'react-hook-form'

const ClassNodeComponent: FC<NodeProps<ClassNodeData>> = (props) => {
  const data = props
  const { getNodes, setNodes, setEdges } = useReactFlow()

  const [nodeClass, setNodeClass] = useState(data)
  const methods = useForm<ClassNode>({
    defaultValues: {
      ...nodeClass,
    },
    resolver: zodResolver(classNodeSchema),
    mode: 'all',
  })

  const {
    watch,
    getValues,
    handleSubmit,
    control,
    getFieldState,
    register,
    formState: { errors, isSubmitted, defaultValues },
  } = methods

  const onSubmit: SubmitHandler<ClassNode> = (data) => {
    const nodes = getNodes()
    setNodes(
      nodes.map((elm: ClassNode) => {
        return elm.id === data.id ? data : elm
      })
    )
  }

  const handleStyle = {
    width: '15px',
    height: '10px',
    background: '#818181',
    borderRadius: '1px',
  }
  const sourceHandle = {
    top: '10px',
  }

  const rightOutputHandle = {}
  const onConnect = useCallback(
    (params: Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )
  const [classNameFieldError, setClassNameFieldError] = useState<fieldPreviewProps | null>(null)
  useEffect(() => {
    //setclassNameFieldError(typeof errors.className === 'undefined' ? false : true )
    setClassNameFieldError(
      typeof errors.data?.className === 'undefined'
        ? null
        : {
            border: '2px',
            borderColor: 'red.400',
          }
    )
  }, [errors.data?.className])

  return (
    <Box>
      <Stack p={3} bg='white' rounded='md' shadow='md' border='1px' borderColor='gray.500'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <FormControl isRequired isInvalid={!!errors.data?.className}>
              <Editable defaultValue={getValues('data.className')}>
                <EditablePreview w='100%' {...classNameFieldError} />
                <EditableInput
                  id='data.className'
                  {...classNameFieldError}
                  {...register('data.className')}
                />
                <FormErrorMessage>{errors.data?.className?.message}</FormErrorMessage>
              </Editable>
            </FormControl>
            <Divider />
            <Box>
              <FunctionsFormFields />
              <Divider />
              <VarsFormFields />
            </Box>
          </FormProvider>
        </form>
        <Box>
          <Button leftIcon={<EditIcon />} type='submit'></Button>
        </Box>
        <Handle type='target' position={Position.Left} style={handleStyle} />
        <Handle type='source' position={Position.Right} style={handleStyle} />
      </Stack>
    </Box>
  )
}

const ClassNodeComp = memo(ClassNodeComponent)

export default ClassNodeComp

/**
 * 
  const [isOpen, setOpen] = useState(false)
 * 
  useCallback(() => {
    setOpen(isOpen ? false : true)
    isOpen ? allowEdit : denyEdit
  }, [isOpen])
 * 
  const EditorOnOpen = useDisclojureStore.getState().onOpen
 * 
 * const { editId, editClassName, editFuncs, editVars, diseditable } = useEditData(
    (state) => ({
      editId: state.id,
      editClassName: state.className,
      editFuncs: state.functions,
      editVars: state.variables,
      diseditable: state.dnotEdit,
    }),
    shallow,
  )

 */
