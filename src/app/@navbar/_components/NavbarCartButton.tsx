'use client'
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import {
    Avatar,
    Badge,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Typography,
    useMediaQuery
} from "@mui/material";
import PopupState, {bindHover, bindPopover, bindToggle} from "material-ui-popup-state";
import {ImageTwoTone} from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from "next/link";
import HoverPopover from 'material-ui-popup-state/HoverPopover'
import {useCart} from "@/context/cartProvider";

export const NavbarCartButton = ({}) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const {basket} = useCart();

    const itemsInCartCount = basket?.items?.length ? basket.items.reduce((acc, item) => {
        return acc + item.quantity;
    }, 0) : undefined

    return <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
            <>
                <IconButton
                    component={Link}
                    href={'/koszyk2'}
                    color={'inherit'}
                    {...!isMobile && bindHover(popupState)}
                >
                    <Badge badgeContent={itemsInCartCount} color="error">
                        <ShoppingCartTwoToneIcon/>
                    </Badge>
                </IconButton>

                {!isMobile && <HoverPopover
                    disableScrollLock
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    slotProps={{paper: {sx: {width: 300}}}}
                >
                    <Stack sx={{px: 2, pt: 2}}>
                        <Typography variant={'h6'}>
                            Koszyk
                        </Typography>
                    </Stack>

                    {(!basket || (basket?.items?.length === 0)) ?
                        <Typography sx={{p: 2, color: 'text.secondary'}}>
                            Koszyk jest pusty
                        </Typography>
                        : <><List>
                            {basket?.items?.map((x) => {
                                return <ListItem key={x.productId}>
                                    <ListItemAvatar>
                                        <ListItemAvatar>
                                            <Avatar component={Link} href={'aaa'} variant={"square"} src={x.image}>
                                                <ImageTwoTone/>
                                            </Avatar>
                                        </ListItemAvatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        slotProps={{primary: {variant: 'subtitle1'}}}
                                        primary={<>
                                            <Typography color={'textSecondary'}
                                                        component={'span'}>{x.quantity} x </Typography>
                                            {x.name}
                                        </>}/>
                                </ListItem>
                            })}
                        </List>

                            <Divider/>

                            <Stack sx={{p: 2}}>
                                <Button
                                    {...bindToggle(popupState)}
                                    component={Link}
                                    href={'/koszyk2'}

                                    variant={'contained'}
                                    endIcon={<ArrowForwardIcon/>}
                                >Przejdź do koszyka</Button>
                            </Stack>
                        </>
                    }
                </HoverPopover>}
            </>
        )}
    </PopupState>
}
